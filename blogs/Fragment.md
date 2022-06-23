# Android 中 Fragment 的常见需求和常见错误

Android 中 Fragment 只能在 Activity 中使用，相当于一个轻量的UI容器，并且具有生命周期。

它的好处在于可以给屏幕适配提供便利，另外现在流行的单 Activity 多 Fragment 开发模式，也正是看中它轻量的特点。

***默认此时看文章的你已经对 Fragment 的基本信息(生命周期、与 Activity 通讯、与 Fragment 通讯)有所了解**

以下是几个可能你经常遇到的与 Fragment 相关的问题

* getSupportFragmentManager 与 getChildFragmentManager 有什么区别？如何规避内存泄漏？
* DialogFragment, ChildFragment, BottomSheetFragment 如何回调到 parentFragment？
* FragmentStateAdapter 与 FragmentPagerAdapter 有什么区别？
* FragmentTransaction 的 add 和 replace 有什么区别？
* receivers boardcasts 内存泄漏
* BottomBarNavigation Drawer 如何处理
* commit commitAllowingStateLoss 区别
* option menus 在 Fragment 上的实现
* getActivity getView 空值处理
* onActivityResult 在多层嵌套的 Fragment 中的处理
* Fragment 和 Bundle
* Navigation 返回栈处理

## getSupportFragmentManager 与 getChildFragmentManager

> getFragmentManager() 已经废弃，现在统一使用 getSupportFragmentManager()
> 
> 前者是 android.app 包下的，后者是 androidx.fragment.app 包下的。

FragmentManager 是 Android Framework 提供的可以对 Fragment 提供增、删、替换操作的工具，这每个操作叫做 transaction (事务/交易)。

* getSupportFragmentManager 与 Activity 相关联，返回当前 Activity 的 FragmentManager
  所以不管是 ViewPager、ViewPager2还是BottomSheetFragment，只要它从Activity这个级别出现，就应该使用 getSupportFragmentManager
  
* getChildFragmentManager 与 Fragment 关联
  在 Fragment 内部出现的元素都应该使用 getChildFragmentManager

所以最常见的 FragmentManager 使用不当导致的内存泄漏，就是在 Fragment 里使用 getSupportFragmentManager

让我们分析一下

假设Activity中有 ViewPager 显示不同页面，这些 Fragment 都存在于 Acitvity中，因为只能使用 getSupportFragmentManager。

我们再用 getSupportFragmentManager 向其中一个 Fragment 添加 testViewPager，那么 testViewPager 中的所有 Fragment 也会存在在 Activity 中。

这时候如果父 Fragment 被销毁，由于它持有 testViewPager，testViewPager 持有子 Fragment，子 Fragment 持有 Activity，父 Fragment 会永远存在于内存中，直到 Activity 被摧毁。

**所以千万不要在 Fragment 中使用 getSupportFragmentManager**


## Fragment 回调到 Parent Fragment

> 这在 Fragment 内使用 DialogFragment、BottomSheetDialogFragment时非常常见。

比如在弹出 DialogFragment 中有控制按钮，控制 Parent Fragment 的 UI 状态。

大部分人会直接使用 Activity 作为 这两个 Fragment 通信的桥梁；
小部分人会将接口实现的监听对象作为参数传给 DialogFragment，这是绝对不推荐的。
最佳做法，是 Parent Fragment 实现 Callback 接口，然后 DialogFragment 中通过 getParentFragment 强转来获取 callback。

``` java
new MyDialogFragment().show(ParentFragment.this.getChildFragmentManager(), MyDialogFragment.TAG);
```

``` java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
        callback = (Callback) getParentFragment();
    } catch (ClassCastException e) {
        throw new ClassCastException("Calling fragment must implement Callback interface");
    }
}
```

使用同样的方式，在 ViewPager 中的 Fragment 也可以回调到持有 ViewPager 的 Fragment。

## FragmentStateAdapter 与 FragmentPagerAdapter

> 这两者都是 ViewPager 的适配器，用来协调 Fragment。

FragmentPagerAdapter 会在内存中保存所有的 Fragment，可能造成内存占用过高。 
FragmentStatePagerAdapter 只会存储 Fragment 的 savedInstanceState，其他没获取焦点的 Fragment 会被完全摧毁。

所以，如果页面有很多 Fragment，用 FragmentStatePagerAdapter，三个及以下用 FragmentPagerAdapter

....
